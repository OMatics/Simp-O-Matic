#!/usr/bin/env ruby
require 'json'
require 'readline'

URL = 'https://simp.knutsen.co'
$guild = 'GLOBAL'

def send_message message
  body = {
    :console => true,
    :message => message,
    :secret  => ENV['WEB_SECRET']
  }
  body[:guild] = $guild unless $guild == 'GLOBAL'
  payload = JSON.dump body
  puts " [*] Sending payload:\n    #{payload}"

  command = ['curl', '-d', payload, URL]
  system *command
end

while input = Readline.readline("[#{$guild}]> ", true)
  if input.start_with? '/'
    command, *args = input[1..].split ' '

    case command
    when 'guild'
      $guild = args[0]
    end
  else
    send_message input
  end
end

