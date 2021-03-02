import React, { FC } from "react";
import styles from '../styles/components/blob-wrapper.module.scss'
import { BlobCanvas } from './blob-canvas'

export const BlobWrapper: FC = ({ children }) => (
  <main className={styles.wrapper}>
    <BlobCanvas className={styles.blob} />
    <div className={styles.content}>
      { children }
    </div>
  </main>
)
