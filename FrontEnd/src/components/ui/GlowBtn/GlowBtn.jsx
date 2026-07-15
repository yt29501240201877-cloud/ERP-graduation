import Styles from './GlowBtn.module.css'

export default function GlowBtn(props) {
  return (
    <button className={Styles.btn}><i className={`${props.icon} ${props.className}`}></i> {props.text}</button>
  )
}4