package com.yupi.maker.template;


import cn.hutool.core.util.StrUtil;
import com.yupi.maker.meta.Meta;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 模板制作工具类
 */
public class TemplateMakerUtils {

    /**
     * 从未分组文件中移除组内的同名文件
     *
     * @param fileInfoList
     * @return
     */
    public static List<Meta.FileConfig.FileInfo> removeGroupFilesFromRoot(List<Meta.FileConfig.FileInfo> fileInfoList) {
        //获取所有分组
        List<Meta.FileConfig.FileInfo> groupFileInfoList = fileInfoList.stream()
                .filter(fileInfo -> StrUtil.isNotBlank(fileInfo.getGroupKey()))
                .collect(Collectors.toList());
        //获取所有分组的文件列表
        List<Meta.FileConfig.FileInfo> groupInnerFileInfoList = groupFileInfoList.stream()
                .flatMap(fileInfo -> fileInfo.getFiles().stream())
                .collect(Collectors.toList());

        //获取文件列表输入路径集合
        Set<String> InnerFileInputPathList = groupInnerFileInfoList.stream()
                .map(fileInfo -> fileInfo.getInputPath())
                .collect(Collectors.toSet());
        //返回去重后的分组
        return fileInfoList.stream()
                .filter(fileInfo -> !InnerFileInputPathList.contains(fileInfo.getInputPath()))
                .collect(Collectors.toList());

    }
}
