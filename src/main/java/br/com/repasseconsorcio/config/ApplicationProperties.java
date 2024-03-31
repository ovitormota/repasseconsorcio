package br.com.repasseconsorcio.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Properties specific to Repasseconsorcio.
 * <p>
 * Properties are configured in the {@code application.yml} file.
 * See {@link tech.jhipster.config.JHipsterProperties} for a good example.
 */
@ConfigurationProperties(prefix = "application.aws.s3", ignoreUnknownFields = false)
public class ApplicationProperties {

    private String accessKey;
    private String secretKey;
    private String bucketName;
    private String region;

    // Getters e Setters

    public String getAccessKey() {
        return accessKey;
    }

    public void setAccessKey(String accessKey) {
        this.accessKey = accessKey;
    }

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public String getBucketName() {
        return bucketName;
    }

    public void setBucketName(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }
}
