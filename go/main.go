package main

import (
	"fmt"
	"io"
	"math/rand/v2"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main() {

	
	http.HandleFunc("/", handleDefault)

	http.HandleFunc("/random-error", handleDefault)

	http.HandleFunc("/bad", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Request to /bad")

		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error occured"))

	})

	http.HandleFunc("/healthy", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World!")
	})

	http.HandleFunc("/remote", func(w http.ResponseWriter, r *http.Request) {		
		fmt.Println("Request to /remote")
		url := os.Getenv("REMOTE_URL")
		if url == "" {
			url = "https://api.chucknorris.io/jokes/random"
		}

		resp, err := http.Get(url)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error occurred"))
			return
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error occurred"))
			return
		}

		fmt.Fprint(w, string(body))
	})

	http.HandleFunc("/readiness", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Ready")
	})

	http.HandleFunc("/liveness", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Live")
	})

	http.ListenAndServe(":8080", nil)
}

func handleDefault(responseWriter http.ResponseWriter, request *http.Request) {	
		fmt.Println("Request to /")		
		timeEnv := os.Getenv("TIME")
		var timeInt int = 500
		var timeErrorInt int = 300
		if timeEnv != "" {
			t, err := strconv.Atoi(timeEnv)
			if err == nil {
				timeInt = t
			}	
		}
		timeErrorEnv := os.Getenv("TIME_FOR_ERROR")		
		if timeErrorEnv != "" {
			t, err := strconv.Atoi(timeErrorEnv)
			if err == nil {
				timeErrorInt = t
			}	
		}

		randomNumber := rand.IntN(timeInt)
		time.Sleep(time.Millisecond * time.Duration(randomNumber))
		if randomNumber > timeErrorInt {
			fmt.Fprintf(responseWriter, "Hello World!")
		} else {
			responseWriter.WriteHeader(http.StatusInternalServerError)
			responseWriter.Write([]byte("Error occured"))
		}
	}

