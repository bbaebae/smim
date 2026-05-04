import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: settings } = await supabase
    .from('user_settings')
    .select('email_notify, push_notify')
    .eq('user_id', user.id)
    .single()

  return (
    <SettingsClient
      email={user.email ?? ''}
      initialEmailNotify={settings?.email_notify ?? true}
      initialPushNotify={settings?.push_notify ?? false}
    />
  )
}
