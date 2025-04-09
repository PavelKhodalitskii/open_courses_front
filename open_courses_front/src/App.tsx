import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Toaster } from "@/components/ui/sonner";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Hello, Ipsilon</h1>
      <Toaster />
    </>
  )
}

export default App
