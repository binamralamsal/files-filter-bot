name: English

bot_started=
  Database Connection Succeeded!

  Now, Bot is up and running!!!

welcome_message_caption=
  > Welcome here ✨

  We are happy to see you here\.

  We are a Brand who provide all kind of content to members with no cost\.


join_required_chats=
  ⚠️ Caution:- 
  > For Getting Your Files, First You Have to Join Listed "Channels/Groups" Given Below👇🏻

join_required_chat_message=
  > Don't forget to join channels/groups given below and get what you dream in your life. ✌🏻

users_scanned=
  > Total number of users scanned: { $usersLength }

no_message_to_broadcast=
  > No message to broadcast! 

  Please mention the message that you want to broadcast

no_users_to_broadcast=
  Not enough users are recorded yet!

  > Please try again later


broadcasting_message=
  > Broadcasting your message to { $length } members

broadcast_complete=
  > Successfully broadcasted your message to { $successCount }/{ $length } members\.
  
  > Failed for { $failedCount } members

welcome_message_channels_given=
  Don't forget to join channels given below and get what you dream in your life\. ✌🏻

channel_already_exists=
  Sorry but that channel already exists\.

  Please use `/del channelId` if you want to delete or add again\.

adding_channel=
  > Adding files from `{ $channelId }` in database

error_while_adding_files=
  `{ $errorMessage }`

  Error while adding files\. Channel not found\!

  Be sure the account that you are using for bot is added to the channel that you are trying to add\.

adding_finished=
  Added { $fileLength } files from `{ $channelId }` successfully\.

invalid_channel_id=
  > Invalid Channel ID

finding_files_in_channel=
  > Finding for files in `{ $channelId }`

found_files_in_channel=
  > Found { $filesCount } files from `{ $channelId }`

no_channels_found=
  > No channels found\!

channel_not_found_delete=
  > Channel that you are trying to delete i\.e\. `{ $channelId }` not found\!

deleting_channel=
  > Deleting files of `{ $channelId }` from database\.

error_while_deleting_files=
  `{ $errorMessage }`

  Error while deleting channel\. Please check logs for more info\.


deleting_finished=
  > `{ $channelId }` deleted Successfully\!

deleting_all_channels: |
  > Deleting all channels from database\.

deleting_all_finished=
  > All channels deleted Successfully\.

# refreshing_all_channels_deleting: |
#   Refreshing all channels in ${chatName} (<code>${chatId}</code>)

#   <strong>Status</strong>: Deleting ${totalChannels} channels

# refreshing_channel_deleting: |
#   Refreshing ${channelID} channels in ${chatName} (<code>${chatId}</code>)

#   <strong>Status</strong>: Deleting channel

# refreshing_all_channels_adding: |
#   Refreshing all channels in ${chatName} (<code>${chatId}</code>)

#   <strong>Status</strong>: Adding (<code>${channelId}</code>)
#   <strong>${remainingChannels}/${totalChannels} Done</strong>

# refreshing_channel_adding: |
#   Refreshing ${channelID} channel in ${chatName} (<code>${chatId}</code>)

#   <strong>Status</strong>: Adding channel

# refreshing_all_finished: |
#   All channels refreshed successfully!

#   Total Channels refreshed: ${totalChannels}

# refreshing_finished: |
#   ${channelID} refreshed successfully!


# error: |
#   <code>${errorStack}</code>
    
#   ${updateID && '<strong>Update ID</strong>:'} ${updateID}
#   <strong>Message ID</strong>: ${messageID}
#   <strong>Date</strong>: ${date}
#   <strong>Text</strong>: <code>${text}</code>
#   <strong>User</strong>: ${user}
#   <strong>Chat</strong>: ${chat}


# channel_not_found_refresh: |
#   Channel that you are trying to refresh i.e. <code>${channelID}</code> not found!

# no_channelId_given: |
#   Invalid command given!

#   Missing argument [channel-id] after /refresh.

# maintenance_mode_on: |
#   Maintenance mode is <strong>turned on</strong>! Please check back after some time.

#   ${reason && 'Reason: '} ${reason}

# maintenance_mode_off: |
#   Finally, maintenance break is over! 🥳

# invalid_maintenance_instruction: |
#   Invalid Instruction Passed to <code>/maintenance</code> command.

#   Valid instructions are: <code>on</code> and <code>off</code>

# maintenance_mode_not_turned_on: |
#   Maintenance Mode is not turned on!

#   Please use <code>/maintenance on</code> if you want to turn on maintenance mode.

# maintenance_mode_already_turned_on: |
#   Maintenanance Mode is already turned on!

#   Please use <code>/maintenance off</code> if you want to turn off maintenance mode.

# no_files_with_empty_cap: |
#   No files with empty caption found!

# sending_files_with_empty_cap: |
#   I am now sending all files having empty caption.

#   Total Files: ${length}

# files_with_empty_cap_sent: |
#   These were all the files having empty caption!

# bot_not_member_of_channel: |
#   Bot is not member of <code>${channelId}</code>

#   Please add bot so that bot can share files.
