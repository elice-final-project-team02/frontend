import React from 'react';
import styles from './MyTitle.module.scss';
import cs from 'classnames/bind';
const cx = cs.bind(styles);

export default function MyTitle({ text }) {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('title')}>
        <img src="https://ifh.cc/g/zyKAbq.png" alt="캐릭터" />
<<<<<<< HEAD
        <span>{props.text}</span>
=======
        <span>{text}</span>
>>>>>>> dev
      </div>
    </div>
  );
}
