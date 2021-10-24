import { NextPage } from "next"
import Link from "next/link"
import { Anchor } from "src/components/atoms/btn"
import { BlobWrapper } from "src/components/blob-wrapper"

const FiveHundred: NextPage = () => <BlobWrapper>
  <h1 className="title mb-2">500</h1>
  <p className="subtitle mb-10">Something went wrong...</p>
  <Link passHref href="/">
    <Anchor>Go home</Anchor>
  </Link>
</BlobWrapper>

export default FiveHundred
