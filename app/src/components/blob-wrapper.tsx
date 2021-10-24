import { FC } from "react"
import { BlobCanvas } from './blob-canvas'

export const BlobWrapper: FC = ({ children }) => (
  <main className="relative w-screen max-w-sm mx-auto mt-48 text-center">
    <BlobCanvas className="absolute top-1/2 left-1/2" style={{ marginTop: -160, marginLeft: -200 }}/>
    <div className="relative">
      { children }
    </div>
  </main>
)
