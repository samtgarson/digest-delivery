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

export const DigestItem: FC<DigestItemProps> = ({ data }) => <li className="list-none flex items-center">
  <div>
    <p className="font-bold">{ humaniseDate(data.delivered_at) }</p>
    <p className="">{ countLabel(data.articles_count) }</p>
  </div>
  <Link href={`/digests/${data.id}`} passHref>
    <Anchor naked className="ml-auto">More info <ChevronRight className="ml-3" /></Anchor>
  </Link>
</li>
