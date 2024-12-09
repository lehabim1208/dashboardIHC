import dynamic from 'next/dynamic'

const DashboardClient = dynamic(() => import('./login/page'), { ssr: false })

export default function Home() {
  return (
    <main>
      <DashboardClient />
    </main>
  )
}