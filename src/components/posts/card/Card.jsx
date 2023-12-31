import React, { useState } from 'react';
import styles from './Card.module.scss';
import { BsPersonFill } from 'react-icons/bs';
import { FaMapMarkerAlt, FaCalendar, FaClock } from 'react-icons/fa';
import { PiMoneyFill } from 'react-icons/pi';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import * as date from 'lib';
import { LongTerm, ShortTerm, Child, Senior1, Challenged } from 'assets/images';
import { usePutSavePost, usePutCancelPost } from 'hooks';

import cs from 'classnames/bind';
const cx = cs.bind(styles);

export default function Card({ data }) {
  const {
    _id,
    careInformation: { area, careTarget, preferredmateAge, preferredmateGender },
    createdAt,
    isBookmarked,
    reservation: { hourlyRate, isLongTerm, negotiableRate, longTerm, shortTerm },
    title,
  } = data;

  const [isWished, setIsWished] = useState(isBookmarked);
  const { mutate: saveMutate } = usePutSavePost();
  const { mutate: cancelMutate } = usePutCancelPost();

  const titleContainer = cx('title', { 'centered-title': title.length < 10 });
  const formattedHourlyRate = hourlyRate.toLocaleString();
  const formattedMateAge = preferredmateAge.join(' ');

  const currentCareTarget = cx('main-info', {
    child: careTarget === '아동',
    senior: careTarget === '노인',
    disabled: careTarget === '장애인',
  });

  const handleToggleFavorite = async () => {
    try {
      if (isWished) {
        setIsWished(false);
        await cancelMutate(_id);
      } else {
        setIsWished(true);
        await saveMutate(_id);
      }
    } catch (error) {
      console.error('Error toggling wishButton:', error);
    }
  };

  const sortCareDays = (day) => {
    const sortedDays = day
      .map((obj) => date.changeKoreaDayOfWeekToNumber(obj.careDay))
      .sort((a, b) => a - b)
      .map((obj) => date.changeNumberToKoreaDayOfWeek(obj));
    return sortedDays.join(' ');
  };

  return (
    <div className={cx('wrapper')}>
      <div className={cx('card')}>
        <div className={currentCareTarget}>
          <div className={cx('main-upper')}>
            <div className={cx('target-image-container')}>
              <img
                src={careTarget === '아동' ? Child : careTarget === '노인' ? Senior1 : Challenged}
                alt="targetImage"
                className={cx('target-image')}
              />
            </div>
            <div className={cx('upper-info')}>
              {isLongTerm ? <img src={LongTerm} alt="longTerm" /> : <img src={ShortTerm} alt="shortTerm" />}
              <h3 className={titleContainer}>{title}</h3>
            </div>
          </div>
          <div className={cx('main-bottom')}>
            <span className={cx('card-status', careTarget === '아동' && 'black')}>모집중</span>
            <span className={cx('time-stamp')}>등록일 {date.changeDateToMonthAndDate(createdAt)}</span>
            <div className={cx('heartIcons')}>
              {isWished ? (
                <FaHeart
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleFavorite();
                  }}
                />
              ) : (
                <FaRegHeart
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleFavorite();
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className={cx('extra-info')}>
          <ul>
            <li className={cx('location')}>
              <FaMapMarkerAlt color="#d3d3d3" className={cx('extra-info-icon')} />
              {area.region} {area.subRegion}
            </li>
            <li className={cx('date')}>
              <FaCalendar color="#d3d3d3" className={cx('extra-info-icon')} />
              {isLongTerm ? (
                <span className={cx('text-information')}>
                  {`${date.changeDateToMonthAndDate(longTerm.startDate)}~ `}({sortCareDays(longTerm.schedule)})
                </span>
              ) : (
                shortTerm && (
                  <span className={cx('text-information')}>
                    {`${date.changeDateToMonthAndDate(shortTerm[1].careDate)} ~ ${date.changeDateToMonthAndDate(
                      shortTerm[shortTerm.length - 1].careDate
                    )} (총 ${shortTerm.length - 1}일)`}
                  </span>
                )
              )}
            </li>
            <li className={cx('time')}>
              <FaClock color="#d3d3d3" className={cx('extra-info-icon')} />
              {isLongTerm ? (
                <span className={cx('text-information')}>
                  {longTerm &&
                    `${date.changeDateToAmPmAndHour(longTerm.schedule[0]?.startTime)} ~ ${date.changeDateToAmPmAndHour(
                      longTerm.schedule[0]?.endTime
                    )}`}
                </span>
              ) : (
                <span className={cx('text-information')}>
                  {shortTerm &&
                    `${date.changeDateToAmPmAndHour(shortTerm[1].startTime)} ~ ${date.changeDateToAmPmAndHour(
                      shortTerm[1].endTime
                    )}`}
                </span>
              )}
            </li>
            <li className={cx('prefer-mate')}>
              <BsPersonFill color="#d3d3d3" className={cx('extra-info-icon')} />
              {formattedMateAge} {preferredmateGender}
            </li>
            <li className={cx('wage')}>
              <PiMoneyFill color="#d3d3d3" className={cx('extra-info-icon')} />
              {formattedHourlyRate} 원 {negotiableRate ? ' | 협의가능' : ''}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
