'use client'

import React, { useState } from 'react'

export type ContactField = {
  name: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea'
  required: boolean
  half: boolean
  options?: string[]
  defaultValue?: string
}

const control =
  'w-full rounded-media border border-[#B5B5B5] bg-paper px-4 text-[17px] leading-[22px] text-ink focus:border-cobalt focus:outline-none focus:ring-1 focus:ring-cobalt'

/** Posts to the Payload form builder. Shows the result in place, with no page change. */
export const ContactForm: React.FC<{
  formId: number | string
  fields: ContactField[]
  submitLabel: string
  fallbackEmail?: string | null
}> = ({ formId, fields, submitLabel, fallbackEmail }) => {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setState('sending')
    try {
      const response = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formId,
          submissionData: fields.map((field) => ({
            field: field.name,
            value: String(data.get(field.name) ?? ''),
          })),
        }),
      })
      setState(response.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="flex flex-col gap-3 rounded-tile bg-mist p-6 lg:p-8" role="status">
        <p className="type-h3">Thank you.</p>
        <p className="type-body">
          I read every message myself and will reply within two working days.
        </p>
      </div>
    )
  }

  return (
    <form className="grid grid-cols-2 gap-5 rounded-tile bg-mist p-5 lg:p-8" onSubmit={onSubmit}>
      {fields.map((field) => {
        const id = `contact-${field.name}`
        return (
          <div
            className={
              field.half
                ? 'col-span-2 flex flex-col gap-2 sm:col-span-1'
                : 'col-span-2 flex flex-col gap-2'
            }
            key={field.name}
          >
            <label className="text-[15px] font-semibold leading-[18px] text-ink" htmlFor={id}>
              {field.label}
              {!field.required && (
                <span className="font-normal text-muted-foreground"> (optional)</span>
              )}
            </label>
            {field.type === 'textarea' ? (
              <textarea
                className={`${control} h-[180px] py-4`}
                id={id}
                name={field.name}
                required={field.required}
              />
            ) : field.type === 'select' ? (
              <select
                className={`${control} h-14`}
                defaultValue={field.defaultValue}
                id={id}
                name={field.name}
                required={field.required}
              >
                {field.options?.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                autoComplete={
                  field.type === 'email' ? 'email' : field.name === 'name' ? 'name' : undefined
                }
                className={`${control} h-14`}
                id={id}
                name={field.name}
                required={field.required}
                type={field.type}
              />
            )}
          </div>
        )
      })}
      <div className="col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
        <button
          className="rounded-pill bg-cobalt px-6 py-[18px] text-[17px] font-semibold leading-[22px] text-paper hover:bg-[#1630e0] disabled:opacity-60"
          disabled={state === 'sending'}
          type="submit"
        >
          {state === 'sending' ? 'Sending' : submitLabel}
        </button>
        <p className="max-w-[260px] text-[14px] leading-5 text-muted-foreground">
          Your details are used to reply to you and for nothing else.
        </p>
      </div>
      {state === 'error' && (
        <p className="col-span-2 text-[15px] leading-[22px] text-[#B42318]" role="alert">
          The message did not send. Please try again
          {fallbackEmail ? (
            <>
              , or email{' '}
              <a className="underline" href={`mailto:${fallbackEmail}`}>
                {fallbackEmail}
              </a>
            </>
          ) : null}
          .
        </p>
      )}
    </form>
  )
}
