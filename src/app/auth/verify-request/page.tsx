import {MailCheckIcon} from 'lucide-react'

export default function VerifyRequestPage() {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='flex max-w-md flex-col gap-3 p-6'>
        <h1 className='text-center text-2xl font-bold'>Check Your Email</h1>
        <div className='flex justify-center'>
          <MailCheckIcon className='size-10' />
        </div>
        <p className='text-center'>
          A magic link has been sent to your email address. Please check your inbox and click the link to sign in.
        </p>
      </div>
    </div>
  )
}
