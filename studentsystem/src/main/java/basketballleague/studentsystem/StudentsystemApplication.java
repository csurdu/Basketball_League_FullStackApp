package basketballleague.studentsystem;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.PathMatchConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.util.UrlPathHelper;

import java.util.List;

@SpringBootApplication
public class StudentsystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentsystemApplication.class, args);
	}

	@SpringBootApplication
	public class Application {

		public static void main(String[] args) {
			SpringApplication app = new SpringApplication(Application.class);
			app.run(args);
		}

		@Bean
		public WebMvcConfigurer webMvcConfigurer() {
			return new WebMvcConfigurer() {
				@Override
				public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
					MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
					converter.setObjectMapper(new ObjectMapper());
					converters.add(converter);
				}

				@Override
				public void configurePathMatch(PathMatchConfigurer configurer) {
					UrlPathHelper urlPathHelper = new UrlPathHelper();
					urlPathHelper.setAlwaysUseFullPath(true);
					configurer.setUrlPathHelper(urlPathHelper);
				}
			};
		}
	}


}
