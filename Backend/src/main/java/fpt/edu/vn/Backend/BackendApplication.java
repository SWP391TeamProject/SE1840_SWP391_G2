package fpt.edu.vn.Backend;

import fpt.edu.vn.Backend.dbgen.DbGenService;
import fpt.edu.vn.Backend.pojo.AuctionSession;
import fpt.edu.vn.Backend.repository.AuctionSessionRepos;
import fpt.edu.vn.Backend.service.AuctionSessionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.context.ServletWebServerInitializedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

@SpringBootApplication
//@EnableScheduling
@Slf4j

public class BackendApplication {

	private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

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
