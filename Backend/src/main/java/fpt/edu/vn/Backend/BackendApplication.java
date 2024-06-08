package fpt.edu.vn.Backend;

import fpt.edu.vn.Backend.dbgen.DbGenService;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;

@SpringBootApplication
@CrossOrigin(origins = "http://localhost:5173/**")
@EnableScheduling

public class BackendApplication {

	public static void main(String[] args) {
		SpringApplicationBuilder builder = new SpringApplicationBuilder(BackendApplication.class);
		if (args.length > 0 && args[0].equalsIgnoreCase("gendb")) {
			builder.listeners((ApplicationListener<ServletWebServerInitializedEvent>) event -> {
				DbGenService myService = event.getApplicationContext().getBean(DbGenService.class);
				try {
					myService.generate();
				} catch (IOException e) {
					throw new RuntimeException(e);
				}
			});
		}
		builder.run(args);
	}

}
