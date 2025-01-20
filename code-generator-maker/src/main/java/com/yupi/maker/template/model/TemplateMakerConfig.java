package com.yupi.maker.template.model;

import com.yupi.maker.meta.Meta;
import lombok.Data;

@Data
public class TemplateMakerConfig {

    private Long id;

    private Meta meta;

    private String originProjectPath;

    TemplateMakerFileConfig fileConfig = new TemplateMakerFileConfig();

    TemplateMakerModelConfig modelConfig = new TemplateMakerModelConfig();

    TemplateMakerOutputConfig outputConfig = new TemplateMakerOutputConfig();
}
