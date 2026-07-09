package bookshop;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bookshopOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Bookshop API")
                .description("REST API for managing book inventory")
                .version("v1"));
    }
}
