package main

import (
	"fmt"
	"math/rand/v2"
	"net/http"
	"time"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Request to /")
		randomNumber := rand.IntN(500)
		time.Sleep(time.Millisecond * time.Duration(randomNumber))
		if randomNumber > 300 {
			fmt.Fprintf(w, "Hello World!")
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error occured"))
		}

	})

	http.HandleFunc("/random-error", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Request to /random-error")
		randomNumber := rand.IntN(500)
		time.Sleep(time.Millisecond * time.Duration(randomNumber))
		if randomNumber > 300 {
			fmt.Fprintf(w, "Hello World!")
		} else {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Error occured"))
		}

	})

	http.HandleFunc("/bad", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Request to /bad")

		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte("Error occured"))

	})

	http.HandleFunc("/healthy", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello World!")
	})

	http.HandleFunc("/remote", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "To be implemented!")
	})

	http.HandleFunc("/readiness", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Ready!")
	})

	http.HandleFunc("/liveness", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Live!")
	})

	http.ListenAndServe(":8080", nil)
}
