package com.yuwan.ai_code_backend.controller;

import com.yuwan.ai_code_backend.common.BaseResponse;
import com.yuwan.ai_code_backend.common.ResultUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping("/")
    public BaseResponse<String> healthCheck() {
        return ResultUtils.success("OK");
    }
}

