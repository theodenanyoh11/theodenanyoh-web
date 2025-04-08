'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { useRouter } from 'next/navigation'
import React, { useCallback, useState, useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import RichText from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { fields } from './fields'
import { getClientSideURL } from '@/utilities/getURL'

export type FormBlockProps = {
  blockType?: 'formBlock'
  enableIntro?: boolean
  formId: number | string
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<FormBlockProps> = (props) => {
  const { enableIntro, formId, introContent } = props

  const [form, setForm] = useState<FormType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const formMethods = useForm()
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = formMethods

  useEffect(() => {
    const fetchForm = async () => {
      setIsLoading(true)
      setError(undefined)
      try {
        const req = await fetch(`${getClientSideURL()}/api/forms/${formId}`)
        if (!req.ok) {
          throw new Error(`Failed to fetch form: ${req.statusText}`)
        }
        const formData: FormType = await req.json()
        setForm(formData)
        reset(
          formData.fields?.reduce(
            (acc, field) => {
              if ('name' in field && field.name) {
                acc[field.name] = 'defaultValue' in field ? field.defaultValue : ''
              }
              return acc
            },
            {} as Record<string, any>,
          ),
        )
        setIsLoading(false)
      } catch (err: unknown) {
        console.error(err)
        setError({ message: err instanceof Error ? err.message : 'Failed to load form.' })
        setIsLoading(false)
      }
    }

    if (formId) {
      void fetchForm()
    }
  }, [formId, reset])

  const onSubmit = useCallback(
    (data: Record<string, unknown>) => {
      if (!form) return

      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formId,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()
          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || 'Internal Server Error',
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (form.confirmationType === 'redirect' && form.redirect) {
            const { url } = form.redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: 'Something went wrong during submission.' })
        }
      }
      void submitForm()
    },
    [router, formId, form],
  )

  if (isLoading && !form) {
    return <div className="container">Loading Form...</div>
  }

  if (error && !form) {
    return <div className="container">Error loading form: {error.message}</div>
  }

  if (!form) {
    return <div className="container">Form not available.</div>
  }

  return (
    <div className="container lg:max-w-[48rem]">
      {enableIntro && introContent && !hasSubmitted && (
        <RichText className="mb-8 lg:mb-12" data={introContent} enableGutter={false} />
      )}
      <div className="p-4 lg:p-6 border border-border rounded-[0.8rem]">
        <FormProvider {...formMethods}>
          {!isLoading && hasSubmitted && form.confirmationType === 'message' && (
            <RichText data={form.confirmationMessage} enableGutter={false} />
          )}
          {isLoading && !hasSubmitted && <p>Submitting, please wait...</p>}
          {error && !hasSubmitted && (
            <div>{`${error.status || 'Error'}: ${error.message || ''}`}</div>
          )}
          {!hasSubmitted && (
            <form id={String(formId)} onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4 last:mb-0">
                {form.fields?.map((field, index) => {
                  const FieldComponent: React.FC<any> =
                    fields?.[field.blockType as keyof typeof fields]
                  if (FieldComponent) {
                    return (
                      <div className="mb-6 last:mb-0" key={index}>
                        <FieldComponent
                          {...field}
                          control={control}
                          errors={errors}
                          register={register}
                        />
                      </div>
                    )
                  }
                  return null
                })}
              </div>
              <Button form={String(formId)} type="submit" variant="default">
                {form.submitButtonLabel}
              </Button>
            </form>
          )}
        </FormProvider>
      </div>
    </div>
  )
}
