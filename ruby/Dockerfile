FROM ruby:3.3.6 
WORKDIR /app
COPY Gemfile* .
COPY server.rb .
RUN gem install rackup puma
RUN bundle install
COPY . .
EXPOSE 8080
CMD ["ruby", "server.rb"]