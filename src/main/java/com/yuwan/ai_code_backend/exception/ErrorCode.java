package com.yuwan.ai_code_backend.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {

    // 成功状态码
    SUCCESS(0, "ok"),
    // 参数错误状态码
    PARAMS_ERROR(40000, "请求参数错误"),
    // 未登录错误状态码
    NOT_LOGIN_ERROR(40100, "未登录"),
    // 无权限错误状态码
    NO_AUTH_ERROR(40101, "无权限"),
    // 数据不存在错误状态码
    NOT_FOUND_ERROR(40400, "请求数据不存在"),
    // 禁止访问错误状态码
    FORBIDDEN_ERROR(40300, "禁止访问"),
    // 系统错误状态码
    SYSTEM_ERROR(50000, "系统内部异常"),
    // 操作错误状态码
    OPERATION_ERROR(50001, "操作失败");

    /**
     * 状态码
     * 用于标识不同的错误类型
     */
    private final int code;

    /**
     * 信息
     * 用于描述错误的具体内容
     */
    private final String message;

    /**
     * 构造函数
     * @param code 状态码
     * @param message 错误信息
     */
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

}
