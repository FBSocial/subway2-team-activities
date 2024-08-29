import { useDlog } from '@/hooks';
import Api from '@/services/api';
import FbApi from '@/services/FbApi';
import CaptchaUtils from '@/utils/CaptchaUtils';
import { useCountDown, useLocalStorageState, useThrottleFn } from 'ahooks';
import clsx from 'clsx';
import Cookies from 'js-cookie';
import { useEffect, useLayoutEffect, useState } from 'react';
import Modal from 'react-modal';
import VerificationInput from 'react-verification-input';
import Button from './Button';
import './login-card.css';

interface LoginCardProps {
  open: boolean;
  onRequestClose: () => void;
  onLogin: () => void;
}

enum View {
  Phone,
  Captcha,
}

const COUNTDOWN_DURATION = 60 * 1000; // 60 seconds
const PHONE_LENGTH = 11;
const CAPTCHA_LENGTH = 6;
const COOKIE_EXPIRY_DAYS = 7;

export default function LoginCard({
  open,
  onRequestClose,
  onLogin,
}: LoginCardProps) {
  const [phone, setPhone] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [loading, setLoading] = useState(false);
  const [, setLocalUser] = useLocalStorageState('user');
  const [view, setView] = useState(View.Phone);
  const [targetDate, setTargetDate] = useState<number>();
  const [countdown] = useCountDown({ targetDate });
  const loginDlog = useDlog('dlog_app_login_fb');

  const { run: handleSubmit } = useThrottleFn(onSubmit, { wait: 1000 });

  useEffect(() => {
    if (open) setView(View.Phone);
  }, [open]);

  useLayoutEffect(() => {
    document.body.classList.toggle('overflow-hidden', open);
    return () => document.body.classList.remove('overflow-hidden');
  }, [open]);

  const sendCaptcha = async () => {
    setLoading(true);
    try {
      const { ticket, randstr } = await CaptchaUtils.newCaptcha();
      const res = await Api.sendCaptcha(phone, '86', true, ticket, randstr);
      if (!res.status && res.desc) {
        FbApi.toast(res.desc);
      } else {
        setTargetDate(Date.now() + COUNTDOWN_DURATION);
        setView(View.Captcha);
        FbApi.toast('验证码已发送');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (captchaCode: string = captcha) => {
    setLoading(true);
    try {
      const { data, status, desc } = await Api.login({
        captcha: captchaCode,
        area_code: '86',
        mobile: phone,
      });

      if (!status && desc) {
        FbApi.toast(desc);
        return;
      }

      Cookies.set('token', data.sign, { expires: COOKIE_EXPIRY_DAYS });
      onRequestClose();
      onLogin();

      loginDlog?.pushMsg({
        user_id: data?.user_id,
        scene_id: 'dtpk_actv_team',
      });
      setLocalUser({
        avatar: data.avatar,
        userId: data.user_id,
        nickname: data.nickname,
      });
    } finally {
      setLoading(false);
    }
  };

  function onSubmit() {
    if (view === View.Phone) {
      if (phone.length < PHONE_LENGTH) {
        FbApi.toast('请输入正确的手机号码');
        return;
      }
      sendCaptcha();
    } else {
      login();
    }
  }

  const isCountdownActive = countdown > 0;
  const remainingSeconds = Math.round(countdown / 1000);

  return (
    <Modal
      closeTimeoutMS={250}
      isOpen={open}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
    >
      <div className="w-[320px] rounded-[20px] bg-white px-4">
        <p className="pt-10 text-2xl font-medium leading-none">
          {view === View.Phone ? '登录Fanbook账号' : '输入验证码'}
        </p>
        <div className="flex pt-4 text-sm text-b60">
          <div className="flex-1">
            {view === View.Phone
              ? '无Fanbook账号用户将自动注册'
              : `验证码已发送至  +86${phone}`}
          </div>
          {view === View.Captcha && (
            <div
              className="cursor-pointer select-none text-blue"
              onClick={() => setView(View.Phone)}
            >
              修改
            </div>
          )}
        </div>
        <div className="mt-6 h-[46px] w-full text-sm">
          {view === View.Phone ? (
            <div className="flex h-full items-center rounded-[10px] bg-[#f3f4f5] px-3">
              <div className="w-[37px] font-medium">+86</div>
              <div className="h-[18px] w-[0.5px] bg-b60" />
              <input
                value={phone}
                maxLength={PHONE_LENGTH}
                onChange={(e) => setPhone(e.target.value)}
                className="h-full flex-1 bg-transparent px-2.5 outline-none"
                type="tel"
                placeholder="请输入手机号"
              />
            </div>
          ) : (
            <VerificationInput
              classNames={{
                container: 'captcha',
                character: 'character',
                characterInactive: 'character--inactive',
                characterSelected: 'character--selected',
                characterFilled: 'character--filled',
              }}
              autoFocus
              placeholder=""
              validChars="0-9"
              onChange={setCaptcha}
              onComplete={login}
            />
          )}
        </div>
        <div className="h-[68px]">
          {view === View.Captcha && (
            <p
              className={clsx(
                'pt-4 text-sm',
                isCountdownActive ? 'text-b60' : 'text-blue',
              )}
            >
              {isCountdownActive ? (
                `${remainingSeconds} 秒后可重新获取验证码`
              ) : (
                <span
                  className="cursor-pointer select-none"
                  onClick={sendCaptcha}
                >
                  重新获取验证码
                </span>
              )}
            </p>
          )}
        </div>
        <Button
          disabled={view === View.Captcha && captcha.length !== CAPTCHA_LENGTH}
          loading={loading}
          className="mb-[34px] h-[50px] w-full rounded-full bg-blue text-[20px] font-medium text-white"
          onClick={handleSubmit}
        >
          {view === View.Phone ? '获取验证码' : '确认'}
        </Button>
      </div>
    </Modal>
  );
}
