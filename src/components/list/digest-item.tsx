import { humaniseDate } from "common/util"
import Link from "next/link"
import { FC } from "react"
import { ChevronRight } from "react-feather"
import { DigestEntityWithMeta } from "types/digest"
import { Anchor } from "../atoms/btn"

type DigestItemProps = {
  data: DigestEntityWithMeta
}

export const articleCountLabel = (n?: number): string => !n ? 'No articles' : n === 1 ? '1 article' : `${n} articles`

export const DigestItem: FC<DigestItemProps> = ({ data }) => <li className="list-none">
  <Link href={`/digests/${data.id}`}>
    <Anchor aria-label={`View digest from ${humaniseDate(data.deliveredAt)}`} naked small className="flex items-center p-3 w-full">
      {/* <img src={`/api/covers/${dateString(data.deliveredAt)}.png`} className="h-24 mr-4 rounded" /> */}
      <div>
        <p className="font-bold">{ humaniseDate(data.deliveredAt) }</p>
        <p className="">{ articleCountLabel(data._count?.articles) }</p>
      </div>
      <span className="ml-auto"><ChevronRight className="ml-3" /></span>
    </Anchor>
  </Link>
</li>
