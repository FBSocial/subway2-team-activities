interface TencentCaptchaCallbackArguments {
  ret: TencentCaptchaCallbackReturn;
  // 验证成功的票据，当且仅当 `ret = TencentCaptchaCallbackReturn.Success` 时 ticket 有值。
  ticket?: string;
  // 验证码应用 ID
  CaptchaAppId?: string;
  // 自定义透传参数
  bizState?: object;
  // 本次验证的随机串，后续票据校验时需传递该参数
  randstr: string;
  // 错误 code ，详情请参见 [回调函数 errorCode 说明](https://cloud.tencent.com/document/product/1110/36841)。
  errorCode: TencentCaptchaCallbackErrorCode;
  // 错误信息
  errorMessage: string;
}

interface TencentCaptchaOptions {
  // 自定义透传参数，业务可用该字段传递少量数据，该字段的内容会被带入 callback 回调的对象中。
  bizState?: object;
  /**
   * 开启自适应深夜模式或强制深夜模式。（VTT 空间语义验证暂不支持该功能）
   * 1. 开启自适应深夜模式: {"enableDarkMode": true}
   * 2. 强制深夜模式: {"enableDarkMode": 'force'}
   */
  enableDarkMode?: boolean | 'force';
  /**
   * 示例 {"width": 140, "height": 140}
   * 仅支持移动端原生 webview 调用时传入，用来设置验证码 loading 加载弹窗的大小（注意，并非验证码弹窗大小）。
   */
  sdkOpts?: { width: number; height: number };
  /**
   * 验证码加载完成的回调，回调参数为验证码实际的宽高（单位：px）
   * 该参数仅为查看验证码宽高使用，请勿使用此参数直接设定宽高。
   */
  ready?: ({ sdkView: { width: number, height: number } }) => void;
  /**
   * 隐藏帮助按钮或自定义帮助按钮链接。（VTT 空间语义验证暂不支持自定义链接）
   * 隐藏帮助按钮: {"needFeedBack": false }
   * 自定义帮助链接: {"needFeedBack": 'url地址' }
   */
  needFeedBack?: boolean | string;
  // 是否在验证码加载过程中显示loading框。不指定该参数时，默认显示loading框。
  loading?: boolean;
  /**
   * 指定验证码提示文案的语言，优先级高于控制台配置。（VTT 空间语义、文字点选验证暂不支持语言配置）
   * 支持传入值同 navigator.language 用户首选语言，大小写不敏感。
   * 详情参见 userLanguage 配置参数。
   */
  userLanguage: string | 'zh-cn';
  /**
   * 定义验证码展示方式。
   * 1. popup（默认）弹出式，以浮层形式居中弹出展示验证码。
   * 2. embed 嵌入式，以嵌入指定容器元素中的方式展示验证码。
   */
  type?: 'popup' | 'embed';
}

declare class TencentCaptcha {
  constructor(
    private CaptchaAppId: string,
    private callback: (args: TencentCaptchaCallbackArguments) => void,
    private options: TencentCaptchaOptions,
  ) {
    super();
  }

  show();
}
