#!/usr/bin/env ruby
require 'json'

URL = 'simp-o-matic.herokuapp.com'
$guild = 'GLOBAL'

def send_message message
  body = {
    :console => true,
    :message => message,
  }
  body[:guild] = $guild unless $guild == 'GLOBAL'
  payload = JSON.dump body
  puts "Sending payload: #{payload}"

  command = ['curl', '-d', payload, URL]
  system *command
end

loop do
  print "#{$guild}> "
  input = gets.strip
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

