package com.yuwan.ai_code_backend.service;

import cn.hutool.core.bean.BeanUtil;
import com.mybatisflex.core.query.QueryWrapper;
import com.mybatisflex.core.service.IService;
import com.yuwan.ai_code_backend.exception.BusinessException;
import com.yuwan.ai_code_backend.exception.ErrorCode;
import com.yuwan.ai_code_backend.model.dto.app.AppQueryRequest;
import com.yuwan.ai_code_backend.model.entity.App;
import com.yuwan.ai_code_backend.model.entity.User;
import com.yuwan.ai_code_backend.model.vo.AppVO;
import com.yuwan.ai_code_backend.model.vo.UserVO;
import reactor.core.publisher.Flux;

import java.util.List;

/**
 * 应用 服务层。
 *
 * @author <a>程序员鱼丸涛</a>
 */
public interface AppService extends IService<App> {
    /**
     * 生成应用代码(流式)
     * @param appId
     * @param message
     * @param loginUser
     * @return
     */
    Flux<String> chatToGenCode(Long appId, String message, User loginUser);

    /**
     * 部署应用
     * @param appId
     * @param loginUser
     * @return
     */
    String deployApp(Long appId, User loginUser);

    /**
     * 根据App实体获取AppVO
     * @param app
     * @return
     */
     AppVO getAppVO(App app);


    /**
     * 构造查询请求
     * @param appQueryRequest
     * @return
     */
     QueryWrapper getQueryWrapper(AppQueryRequest appQueryRequest);

    /**
     * 批量获取AppVO列表
     * @param appList
     * @return
     */
     List<AppVO> getAppVOList(List<App> appList);

}
