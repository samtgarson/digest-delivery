import { FC } from "react"
import styles from '../styles/components/button.module.scss'

// type BtnProps = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

export const Btn: FC = ({ children }) => <button className={styles.button}>{ children }</button>
