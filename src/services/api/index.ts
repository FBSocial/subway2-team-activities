import { fbEncrypt } from '@/utils/fb_encrypt.ts';
import queryString from 'query-string';
import 'whatwg-fetch';
import { get, getWithNotSign, post, postWithErrorToast } from '../http';

/** 活动 ID，从环境变量中获取 */
const ACTIVITY_ID = import.meta.env.VITE_ACTIVITY_ID;

/**
 * 任务类型枚举
 */
export enum TaskType {
  GlobalTask = 1, // 全局任务
  Invite = 4, // 邀请任务
  SubType = 11, // 子类型任务
}

/**
 * 用户接口
 */
export interface User {
  user_id: number; // 用户ID
  member_id: string; // 成员ID
  invite_id: number; // 邀请ID
  updated_at: string; // 更新时间
  inviter_id: string; // 邀请者ID
  activity_id: number; // 活动ID
  nickname: string; // 昵称
  created_at: string; // 创建时间
  avatar: string; // 头像
}

/**
 * 奖励接口
 */
export interface Reward {
  img: string; // 奖励图片
  gift_id: number; // 礼物ID
  name: string; // 礼物名称
  activity_id: number; // 活动ID
  type: number; // 类型
  prizes: {
    id: number; // 奖品ID
    prize: { prize_id: number; name: string; type: number }; // 奖品详情
    prize_id: number; // 奖品ID
    prize_num: number; // 奖品数量
  }[];
}

/**
 * 公会接口
 */
interface Guild {
  guild_id: string; // 公会ID
  name: string; // 公会名称
  description: string; // 公会描述
  icon: string; // 公会图标
  authenticate: string; // 认证信息
  invite_banner: boolean; // 邀请横幅
  banner: string; // 横幅
  memberNum: number; // 成员数量
}

/**
 * 代码接口
 */
interface Code {
  status: number; // 状态
  channel_on_del: number; // 频道删除状态
  channel_type: null; // 频道类型
  layout: string; // 布局
}

/**
 * 任务状态枚举
 */
export enum TaskStatus {
  None, // 无状态
  Finished, // 已完成
  Received, // 已领取
}

/**
 * 任务接口
 */
export interface Task {
  task_id: number; // 任务ID
  activity_id: number; // 活动ID
  name: string; // 任务名称
  type: TaskType; // 任务类型
  sub_type: number; // 子类型
  is_once: boolean; // 是否一次性任务
  is_auto_reward: boolean; // 是否自动奖励
  gift_id: number; // 礼物ID
  gift_num: number; // 礼物数量
  extra_data: { invite_num: number }; // 额外数据
  status: TaskStatus; // 任务状态
}

/**
 * 活动接口
 */
export interface Activity {
  guild_id: string; // 公会ID
  config: {
    backgrounds: string[]; // 背景图片
    reward_illustration: string; // 奖励插图
    reward_modal_inner_text_content: ''; // 应用内领奖 HTML 代码片段
    reward_modal_outer_text_content: ''; // H5领奖 HTML 代码片段
  };
  gifts: Reward[]; // 奖励列表
  invite: string; // 邀请信息
  tasks: Task[]; // 任务列表
  user: {
    user_id: number; // 用户ID
    step: number; // 步骤
    nickname: string; // 昵称
    avatar: string; // 头像
    tasks: Task[]; // 任务列表
  };
  title: string; // 标题
  description: string; // 描述
  my_invite?: User[]; // 我的邀请
  invite_joined?: User[]; // 已加入邀请
  start_time: number; // 开始时间
  end_time: number; // 结束时间
}

/**
 * H5页面响应接口
 */
export interface H5PageResponse {
  status: boolean; // 状态
  code: number; // 代码
  message: string; // 消息
  desc: string; // 描述
  request_id: string; // 请求ID
  data: {
    user: User; // 用户信息
    guild: Guild; // 公会信息
    code: Code; // 代码信息
  };
  is_active: boolean; // 活动是否进行中，1=是，0=否
}

/**
 * 礼物项结构接口
 */
export interface GiftItemStruct {
  gift_id: number; // 礼物ID
  extra_data: { cdkey: string }; // 额外数据
  gift: { name: string; img: string; num: number }; // 礼物详情
  source_data: { type: TaskType }; // 来源数据
}

/**
 * API类
 */
export default class Api {
  /**
   * 领取任务奖励
   * @param taskId 任务ID
   * @returns 返回领取任务奖励的响应
   */
  static receiveTaskRewards(taskId: number) {
    return postWithErrorToast('/api/activity/act/reward', {
      activity_id: ACTIVITY_ID,
      task_id: taskId,
    });
  }

  /**
   * 接受邀请
   * @param code 邀请码
   * @returns 返回接受邀请的响应
   */
  static acceptInvite(code: string) {
    return post<{ status: number; url: string; desc: string; message: string }>(
      '/api/activity/invite/accept',
      { code },
    );
  }

  /**
   * 发起邀请
   * @returns 返回发起邀请的响应
   */
  static invite() {
    return post<{ code: string }>('/api/activity/invite/do', {
      activity_id: ACTIVITY_ID,
    }).then((res) => res.data);
  }

  /**
   * 获取邀请信息
   * @param code 邀请码
   * @returns 返回邀请信息的响应
   */
  static async getInvitedInfo(code: string) {
    return getWithNotSign<{
      activity: Activity;
      user: User;
      invite_joined?: User[];
      code: string;
    }>(`/api/actCode/h5Page?code=${code}&extra=invite_joined`).then(
      (res) => res.data,
    );
  }

  /**
   * 获取活动信息
   * @param extra 额外信息
   * @returns 返回活动信息的响应
   */
  static async getActivity(
    extra: 'invite_joined' | 'my_invite' | 'invite_joined,my_invite',
  ): Promise<Activity> {
    const response = await post<Activity>('/api/activity/act/get', {
      activity_id: ACTIVITY_ID,
      extra,
    });

    if (!response.data) {
      throw new Error('No data received from the server');
    }

    const data = response.data;

    const parseExtraData = (items: Task[]) => {
      if (!items || items.length === 0) return [];
      return items.map((item) => {
        const extra_data =
          item.extra_data && typeof item.extra_data === 'string'
            ? JSON.parse(item.extra_data)
            : item.extra_data;
        return {
          ...item,
          extra_data,
        };
      });
    };

    const tasks = data.tasks ? parseExtraData(data.tasks) : [];

    const parsedResponse = {
      ...data,
      tasks,
    };

    if (data.user && data.user.tasks) {
      const userTasks = data.user?.tasks ? parseExtraData(data.user.tasks) : [];
      parsedResponse.user = {
        ...data.user,
        tasks: userTasks,
      };
    }
    return parsedResponse;
  }

  /**
   * 发送验证码
   * @param mobile 手机号
   * @param areaCode 区号
   * @param encrypt 是否加密
   * @param captcha_ticket 验证码票据
   * @param captcha_rand_str 验证码随机字符串
   * @returns 返回发送验证码的响应
   */
  static sendCaptcha(
    mobile: string,
    areaCode: string,
    encrypt: boolean,
    captcha_ticket?: string,
    captcha_rand_str?: string,
  ) {
    return post<never>('/api/common/verification', {
      mobile: encrypt ? fbEncrypt(mobile) : mobile,
      area_code: areaCode,
      encrypt_type: 'FBE',
      device: 'web',
      code_type: null,
      captcha_ticket,
      captcha_rand_str,
    });
  }

  /**
   * 登录
   * @param params 登录参数
   * @returns 返回登录的响应
   */
  static login(params: { captcha: string; area_code: string; mobile: string }) {
    return post<{
      avatar: string;
      nickname: string;
      sign: string;
      user_id: string;
    }>('/api/user/login', {
      device: 'web',
      actv_id: ACTIVITY_ID,
      code: fbEncrypt(params.captcha),
      area_code: params.area_code,
      encrypt_type: 'FBE',
      mobile: fbEncrypt(params.mobile),
      type: 'mobile',
    });
  }

  /**
   * 获取礼物记录
   * @returns 返回礼物记录的响应
   */
  static getGiftRecord() {
    return post<{
      lists: GiftItemStruct[];
    }>('/api/activity/user/giftRecords', {
      activity_id: ACTIVITY_ID,
      page: 1,
      page_size: 50,
    }).then((res) => res.data);
  }

  /**
   * 获取邀请页面信息
   * @param c 邀请码
   * @returns 返回邀请页面信息的响应
   */
  static getInvitePageInfo(c: string) {
    const stringified = queryString.stringify({ c });
    return get(`/api/invite/H5Page?${stringified}`).then(
      (res) => (res as H5PageResponse).data,
    );
  }
}
