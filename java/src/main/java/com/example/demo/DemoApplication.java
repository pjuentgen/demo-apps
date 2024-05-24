package com.example.demo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;



@RestController
@SpringBootApplication
public class DemoApplication {

       
        
	@SuppressWarnings("null")
        @RequestMapping("/")
        public ResponseEntity<?> home() throws InterruptedException {

               

                int Random = (int)(Math.random()*500);
                Thread.sleep(Random);
                if (Random > Integer.parseInt("300")){
                        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);        
                }
                return new ResponseEntity<>("Hello World!" + Random, HttpStatus.ACCEPTED);
        }
        @SuppressWarnings("null")
        @RequestMapping("/random-error")
        public ResponseEntity<?>  randomError() {
                return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        @RequestMapping("/remote")
        public String remote() {
                return "to be implemented!";
        }
        @RequestMapping("/healthy")
        public String healthy() {
                return "Healthy";
        }
        @RequestMapping("/bad")
        public ResponseEntity<?>  bad() {
                return new ResponseEntity<>("bad", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        @RequestMapping("/readiness")
        public String readiness() {
                return "Ready";
        }
        @RequestMapping("/liveness")
        public String liveness() {
                return "Live";
        }

 
        public static void main(String[] args) {
                
                SpringApplication.run(DemoApplication.class, args);
        }

}
