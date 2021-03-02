import { FC, HTMLAttributes } from "react"
import styles from '../styles/components/button.module.scss'

export const Btn: FC<HTMLAttributes<HTMLButtonElement>> = ({ children, ...attrs }) => (
  <button {...attrs} className={styles.button}>{ children }</button>
)

export const Anchor: FC<HTMLAttributes<HTMLAnchorElement>> = ({ children, ...attrs }) => (
  <a {...attrs} className={styles.button}>{ children }</a>
)

