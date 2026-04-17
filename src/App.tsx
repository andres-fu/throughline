import { career } from './data/career'
import { CareerTimeline } from './components/CareerTimeline'

export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <h1 className="text-2xl font-bold tracking-tight mb-8">throughline</h1>
      <CareerTimeline entries={career} width={1100} />
    </div>
  )
}
