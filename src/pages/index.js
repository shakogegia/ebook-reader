import Reader from '@/components/reader'
import { content } from '@/utils/constants'

export default function Home() {
  return (
    <main className={`flex min-h-screen flex-col items-center gap-24 p-24`}>

      <h1 className='text-3xl font-serif'>E-Book Reader</h1>

      <Reader content={content} />
    </main>
  )
}
