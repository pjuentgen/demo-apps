package com.example.demo;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@SpringBootApplication
public class DemoApplication {

        @RequestMapping({ "/", "/random-error" })
        public ResponseEntity<?> home() throws InterruptedException {
                System.out.println("Call to / or /random-error");
                int time = 500;
                String timeEnv = System.getenv("TIME");
                if (timeEnv != null) {
                        time = Integer.parseInt(timeEnv);
                }
                int timeForError = 300;
                String timeForErrorEnv = System.getenv("TIME_FOR_ERROR");
                if (timeForErrorEnv != null) {
                        timeForError = Integer.parseInt(timeForErrorEnv);
                }

                int Random = (int) (Math.random() * time);
                Thread.sleep(Random);
                if (Random > timeForError) {
                        return new ResponseEntity<>("Error occured", HttpStatus.INTERNAL_SERVER_ERROR);
                }
                return new ResponseEntity<>("Hello World!", HttpStatus.ACCEPTED);
        }

        @RequestMapping("/remote")
        public String remote() throws URISyntaxException {
                System.out.println("Call to /remote");
                try {
                        String apiUrl = System.getenv("REMOTE_URL");
                        if (apiUrl == null) {
                                apiUrl = "https://api.chucknorris.io/jokes/random";
                        }
                        URI uri = new URI(apiUrl);
                        URL url = uri.toURL();
                        System.out.println("Connecting to" + apiUrl);
                        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
                        connection.setRequestMethod("GET");

                        int responseCode = connection.getResponseCode();
                        if (responseCode == HttpURLConnection.HTTP_OK) {
                                BufferedReader in = new BufferedReader(
                                                new InputStreamReader(connection.getInputStream()));
                                String inputLine;
                                StringBuilder response = new StringBuilder();

                                while ((inputLine = in.readLine()) != null) {
                                        response.append(inputLine);
                                }
                                in.close();

                                return response.toString();
                        } else {
                                return "Error occurred: " + responseCode;
                        }
                } catch (IOException e) {
                        return "Error occurred: " + e.getMessage();
                }
        }

        @RequestMapping("/healthy")
        public String healthy() {
                System.out.println("Call to /healthy");
                return "Hello World!";
        }

        @RequestMapping("/bad")
        public ResponseEntity<?> bad() {
                System.out.println("Call to /bad");
                return new ResponseEntity<>("bad", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        @RequestMapping("/readiness")
        public String readiness() {
                System.out.println("Call to /readiness");
                return "Ready";
        }

        @RequestMapping("/liveness")
        public String liveness() {
                System.out.println("Call to /live");
                return "Live";
        }

        public static void main(String[] args) {

                SpringApplication.run(DemoApplication.class, args);
        }

}
