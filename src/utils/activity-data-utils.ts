import {
  Activity,
  GiftItemStruct,
  Reward,
  Task,
  TaskStatus,
  TaskType,
} from '@/services/api';
import { getCurrentTimeSeconds } from './date-and-time';

/**
 * 活动数据工具类
 */
export default class ActivityDataUtils {
  /**
   * 从 URL 中提取邀请码
   * @param url - 包含邀请码的 URL
   * @returns 提取的邀请码，如果没有找到则返回 undefined
   */
  static getInviteCodeFromUrl(url: string): string | undefined {
    return url?.split?.('/').pop()?.split('?')[0];
  }

  /**
   * 处理用户邀请任务
   * @param data - 包含用户任务的活动数据对象
   * @returns 处理后的用户邀请任务数组
   */
  static processUserInviteTasks(data: { user?: { tasks?: Task[] } }): Task[] {
    // 兜底判断：确保 data.user 和 data.user.tasks 存在
    if (!data || !data.user || !data.user.tasks) {
      return [];
    }

    // 筛选出类型为 TaskType.Invite 的任务
    const filteredTasks = this.filterUserInviteTasks(data.user.tasks);

    // 对筛选出的任务进行处理
    const processedTasks = filteredTasks.map((item) => {
      let extra_data = item.extra_data;

      // 兜底判断：确保 extra_data 存在且是字符串
      if (typeof extra_data === 'string') {
        try {
          extra_data = JSON.parse(extra_data);
        } catch (error) {
          console.error('Failed to parse extra_data:', error);
          extra_data = { invite_num: 0 }; // 默认值，防止程序崩溃
        }
      }

      // 兜底判断：确保 extra_data 存在且包含 invite_num 属性
      if (!extra_data || typeof extra_data.invite_num !== 'number') {
        extra_data = { invite_num: 0 }; // 默认值，防止排序时出错
      }

      return {
        ...item,
        extra_data,
      };
    });

    // 对处理后的任务进行排序
    return processedTasks.sort(
      (a, b) => a.extra_data.invite_num - b.extra_data.invite_num,
    );
  }

  /**
   * 获取邀请奖励的数据
   * @param activity - 活动对象
   * @returns 邀请奖励数据，如果没有找到则返回 undefined
   */
  static getInviteReward(activity: Activity): Reward | undefined {
    const globalTask = this.getGlobalTask(activity);
    return activity?.gifts?.find(
      (gift) => gift.gift_id === globalTask?.gift_id,
    );
  }

  /**
   * 判断任务是否已领取奖励
   * @param task - 任务对象
   * @returns 任务是否已领取奖励
   */
  static isTaskRewardReceived(task?: Task): boolean {
    return task?.status === TaskStatus.Received;
  }

  /**
   * 根据 gift_id 查找对应的 cdKey
   * @param giftRecords - 包含礼物记录的对象
   * @param giftId - 要查找的 gift_id
   * @returns 对应的 cdKey，如果没有找到则返回 undefined
   */
  static findCdKeyByGiftId(
    giftRecords:
      | {
          lists?: GiftItemStruct[];
        }
      | undefined,
    giftId: Reward['gift_id'],
  ): string | undefined {
    if (!giftRecords || !Array.isArray(giftRecords.lists)) {
      return undefined;
    }

    const giftRecord = giftRecords.lists.find((e) => e.gift_id === giftId);
    if (!giftRecord || !giftRecord.extra_data || !giftRecord.extra_data.cdkey) {
      return undefined;
    }

    return giftRecord.extra_data.cdkey;
  }

  /**
   * 从任务中获取奖励
   * @param data - 包含礼物数据的对象,接口响应对象
   * @param tasks - 任务数组
   * @returns 奖励数组
   */
  static getRewardsFromTasks(
    data: { gifts?: Activity['gifts'] },
    tasks: Task[],
  ): Reward[] {
    if (!data || !Array.isArray(data.gifts)) return [];
    // 组装成礼物 id 的对象，再返回对应 task 的奖励
    const gifts = Object.fromEntries(data?.gifts?.map((e) => [e.gift_id, e]));
    return tasks?.map((e) => gifts[e.gift_id]).filter(Boolean);
  }

  /**
   * 获取全局任务
   * @param activity - 活动对象
   * @returns 全局任务数据，如果没有找到则返回 undefined
   */
  static getGlobalTask(activity: Activity): Task | undefined {
    return activity?.tasks?.find((task) => task.type === TaskType.GlobalTask);
  }

  /**
   * 查找用户任务中的全局任务
   * @param tasks - 用户任务数组
   * @returns 全局任务，如果没有找到则返回 undefined
   */
  static findUserGlobalTask(tasks: Task[]): Task | undefined {
    return tasks?.find((task) => task.type === TaskType.GlobalTask);
  }

  /**
   * 判断活动是否已经结束
   * @param data - 包含活动结束时间的对象
   * @returns 活动是否已经结束
   */
  static isActivityEnded(data: { end_time?: number | null }): boolean {
    return !!(data?.end_time && getCurrentTimeSeconds() > data.end_time);
  }

  /**
   * 判断活动是否已经开始
   * @param activity - 包含活动开始时间的对象
   * @returns 活动是否已经开始
   */
  static isActivityStarted(activity: { start_time?: number }): boolean {
    return !!(
      activity?.start_time && getCurrentTimeSeconds() > activity.start_time
    );
  }

  /**
   * 判断活动是否未开始或已经结束
   * @param activity - 包含活动开始时间和结束时间的对象
   * @returns 活动是否未开始或已经结束
   */
  static isActivityNotInProgress(activity: {
    start_time?: number;
    end_time?: number | null;
  }): boolean {
    return !this.isActivityStarted(activity) || this.isActivityEnded(activity);
  }

  /**
   * 判断活动是否已经开始但尚未结束
   * @param activity - 包含活动开始时间和结束时间的对象
   * @returns 活动是否已经开始但尚未结束
   */
  static isActivityInProgress(activity: {
    start_time?: number;
    end_time?: number | null;
  }): boolean {
    return this.isActivityStarted(activity) && !this.isActivityEnded(activity);
  }

  /**
   * 判断用户是否已开团
   * @param user - 用户对象
   * @returns 用户是否已开团
   */
  static isUserGroupStarted(user?: { step?: number }): boolean {
    return !!(user?.step && user.step > 0);
  }

  /**
   * 筛选出类型为 TaskType.Invite 的用户任务
   * @param tasks - 用户任务数组
   * @returns 类型为 TaskType.Invite 的任务数组
   */
  static filterUserInviteTasks(tasks: Task[]): Task[] {
    return tasks?.filter((task) => task.type === TaskType.Invite);
  }

  /**
   * 汇总活动数据
   * @param data - 活动数据对象
   * @returns 汇总后的活动数据
   */
  static summarizeActivityData(data: Activity) {
    // 活动标题
    const activityTitle = data?.title;

    // 活动描述
    const activityDescription = data?.description;

    // 活动开始时间
    const activityStartTime = data?.start_time;

    // 活动结束时间
    const activityEndTime = data?.end_time;

    // 判断活动是否已经开始
    const isActivityStarted = this.isActivityStarted({
      start_time: activityStartTime,
    });

    // 判断活动是否已经结束
    const isActivityEnded = this.isActivityEnded({ end_time: activityEndTime });

    // 判断活动是否正在进行中
    const isActivityInProgress = this.isActivityInProgress({
      start_time: activityStartTime,
      end_time: activityEndTime,
    });

    // 判断活动是否未开始或已经结束
    const isActivityNotStartedOrEnded = this.isActivityNotInProgress({
      start_time: activityStartTime,
      end_time: activityEndTime,
    });

    // 活动礼物列表
    const gifts = data.gifts;

    // 用户任务列表
    const userTasks = data?.user?.tasks ?? [];

    // 用户邀请任务列表
    const userInviteTasks = this.filterUserInviteTasks(userTasks);

    // 用户任务的任务名
    const userTasksNameList = userInviteTasks?.map((item) => item.name);

    // 用户任务的任务状态
    const userTasksStatusList = userTasks?.map((item) => item.status);

    // 用户全局任务
    const userGlobalTask = this.findUserGlobalTask(userTasks);

    // 全局任务
    const globalTask = this.getGlobalTask(data);

    // 邀请奖励
    const inviteReward = this.getInviteReward(data);

    // 邀请码
    const inviteCode = this.getInviteCodeFromUrl(data.invite);

    // 已加入邀请的用户列表
    const inviteJoined = data.invite_joined ?? [];

    // 我的邀请用户列表，如果为空则默认为空数组
    const inviteUserList = data.my_invite ?? [];

    // 用户奖励列表
    const userRewards =
      ActivityDataUtils.getRewardsFromTasks(
        data,
        this.processUserInviteTasks(data),
      ) ?? [];

    // 判断邀请数量是否与奖励数量匹配
    const invitationsMatchRewards =
      inviteUserList.length === userRewards.length;

    // 判断用户是否已开团
    const isUserGroupStarted = this.isUserGroupStarted(data.user);

    // 判断非步骤任务用户是否领取了奖励
    const isRewardReceived = this.isTaskRewardReceived(userGlobalTask);

    // 返回汇总后的活动数据
    return {
      activityTitle, // 活动标题
      activityDescription, // 活动描述
      activityStartTime, // 活动开始时间
      activityEndTime, // 活动结束时间
      activityStatus: {
        isActivityStarted, // 活动是否已经开始
        isActivityEnded, // 活动是否已经结束
        isActivityInProgress, // 活动是否正在进行中
        isActivityNotStartedOrEnded, // 活动是否未开始或已经结束
      },
      gifts, // 活动礼物列表
      userTasks, // 用户任务列表
      userTasksNameList, // 用户任务的任务名
      userInviteTasks, // 用户邀请任务列表
      userTasksStatusList, // 用户任务的任务状态
      userGlobalTask, // 用户全局任务
      inviteReward, // 邀请奖励
      inviteCode, // 邀请码
      inviteJoined, // 已加入邀请的用户列表
      inviteUserList, // 我的邀请用户列表
      invitationsMatchRewards, // 邀请数量是否与奖励数量匹配
      userRewards, // 用户奖励列表
      globalTask, // 全局任务
      isUserGroupStarted, //判断用户是否已开团
      isRewardReceived, // 判断非步骤任务用户是否领取了奖励
    };
  }
}
