import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import React from 'react'

import type { SiteSetting } from '@/payload-types'

import { Button, TextLink } from '@/components/site/Button'
import { Eyebrow, Heading } from '@/components/site/Heading'
import { getCachedGlobal } from '@/utilities/getGlobals'

import { ContactForm, type ContactField } from './ContactForm.client'

export const metadata: Metadata = {
  title: 'Contact | Theo Denanyoh',
  description: 'Get in touch with Theo Denanyoh about a role, a partnership or a project.',
}

const prompts = [
  {
    title: 'Hiring a product leader',
    body: 'Tell me about the team and the product. I will send my resume and the video intro.',
  },
  {
    title: 'Looking for a co-founder',
    body: 'Tell me the problem, who has it and what you have tried so far.',
  },
  {
    title: 'Need something built',
    body: 'Tell me what it should do, your deadline and your budget range.',
  },
]

const supported = ['text', 'email', 'select', 'textarea'] as const

export default async function ContactPage() {
  const payload = await getPayload({ config: configPromise })
  const [{ docs: forms }, settings] = await Promise.all([
    payload.find({
      collection: 'forms',
      where: { title: { equals: 'Contact' } },
      limit: 1,
      depth: 0,
    }),
    getCachedGlobal('site-settings', 2)() as Promise<SiteSetting | null>,
  ])

  const form = forms[0]
  const email = settings?.contactEmail
  const fields: ContactField[] = (form?.fields ?? []).flatMap((field) => {
    if (!(supported as readonly string[]).includes(field.blockType)) return []
    if (!('name' in field) || !field.name) return []
    return [
      {
        name: field.name,
        label: ('label' in field && field.label) || field.name,
        type: field.blockType as ContactField['type'],
        required: Boolean('required' in field && field.required),
        half: 'width' in field && field.width === 50,
        options:
          field.blockType === 'select'
            ? (field.options ?? []).map((option) => option.value)
            : undefined,
        defaultValue:
          field.blockType === 'select' && field.defaultValue ? field.defaultValue : undefined,
      },
    ]
  })

  return (
    // Source order is heading, form, prompts. That is the phone order. On
    // desktop the form moves to a right column that spans both rows.
    <article className="site-container grid gap-10 pb-[72px] pt-12 lg:grid-cols-[1fr_600px] lg:gap-x-24 lg:gap-y-8 lg:pb-32 lg:pt-[88px]">
      <div className="flex flex-col gap-5">
        <Eyebrow>Contact</Eyebrow>
        <Heading as="h1">Tell me what you are working on</Heading>
        <p className="type-lead max-w-[520px]">
          I read every message myself and reply within two working days.
        </p>
      </div>

      <div className="self-start lg:col-start-2 lg:row-span-2 lg:row-start-1">
        {form && fields.length > 0 ? (
          <ContactForm
            fallbackEmail={email}
            fields={fields}
            formId={form.id}
            submitLabel={form.submitButtonLabel || 'Send message'}
          />
        ) : (
          // No form is set up yet. Offer email so the page never dead-ends.
          <div className="flex flex-col items-start gap-5 rounded-tile bg-mist p-6 lg:p-8">
            <p className="type-h3">Email is the fastest way to reach me.</p>
            {email && (
              <Button href={`mailto:${email}`} size="lg">
                Email {email}
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-8 lg:col-start-1">
        <ul className="border-t-2 border-ink">
          {prompts.map((prompt) => (
            <li className="flex flex-col gap-[6px] border-b border-rule py-6" key={prompt.title}>
              <h2 className="type-h4">{prompt.title}</h2>
              <p className="type-body">{prompt.body}</p>
            </li>
          ))}
        </ul>
        <ul className="flex flex-wrap gap-x-8 gap-y-3">
          {email && (
            <li>
              <TextLink className="text-[17px] leading-[22px]" href={`mailto:${email}`}>
                {email}
              </TextLink>
            </li>
          )}
          {(settings?.social ?? []).map((item) => (
            <li key={item.url}>
              <TextLink className="text-[17px] leading-[22px]" href={item.url}>
                {item.label}
              </TextLink>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
