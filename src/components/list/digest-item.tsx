import { humaniseDate } from "common/util"
import Link from "next/link"
import React, { FC } from "react"
import { ChevronRight } from "react-feather"
import { DigestEntityWithMeta } from "types/digest"
import { Anchor } from "../atoms/btn"

type DigestItemProps = {
  data: DigestEntityWithMeta
}

const countLabel = (n: number) => n === 1 ? '1 article' : `${n} articles`

export const DigestItem: FC<DigestItemProps> = ({ data }) => <li className="list-none">
  <Link href={`/digests/${data.id}`}><Anchor naked small className="flex items-center p-3 w-full">
    <div>
      <p className="font-bold">{ humaniseDate(data.delivered_at) }</p>
      <p className="">{ countLabel(data.articles_count) }</p>
    </div>
    <span className="ml-auto"><ChevronRight className="ml-3" /></span>
  </Anchor></Link>
</li>