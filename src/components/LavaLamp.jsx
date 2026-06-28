import styles from './LavaLamp.module.css'

const BLOBS = [
  { w: 340, h: 400, top: '2%',  left: '3%',  color: '#ff1466', t1: '28s', t2: '33s', delay: '0s'   },
  { w: 280, h: 320, top: '55%', left: '68%', color: '#cc00ff', t1: '35s', t2: '27s', delay: '-9s'  },
  { w: 220, h: 260, top: '28%', left: '42%', color: '#ff44aa', t1: '23s', t2: '40s', delay: '-15s' },
  { w: 370, h: 300, top: '68%', left: '8%',  color: '#aa00dd', t1: '40s', t2: '25s', delay: '-6s'  },
  { w: 190, h: 230, top: '10%', left: '74%', color: '#ff0099', t1: '25s', t2: '31s', delay: '-21s' },
  { w: 300, h: 270, top: '42%', left: '52%', color: '#dd0077', t1: '31s', t2: '37s', delay: '-11s' },
  { w: 240, h: 280, top: '78%', left: '50%', color: '#ff66cc', t1: '27s', t2: '22s', delay: '-18s' },
]

export default function LavaLamp() {
  return (
    <div className={styles.lamp}>
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className={styles.blob}
          style={{
            width: b.w,
            height: b.h,
            top: b.top,
            left: b.left,
            background: b.color,
            '--t1': b.t1,
            '--t2': b.t2,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  )
}
