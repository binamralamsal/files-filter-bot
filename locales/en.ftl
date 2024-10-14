name: English

bot_started=
  Database Connection Succeeded!

  Now, Bot is up and running!!!

welcome_message_caption=
  <blockquote>Welcome here ✨</blockquote>

  We are happy to see you here.

  We are a Brand who provide all kind of content to members with no cost.

join_required_chats=
  ⚠️ Caution:- 
  
  <blockquote>For Getting Your Files, First You Have to Join Listed "Channels/Groups" Given Below👇🏻</blockquote>

join_required_chat_message=
  <blockquote>Don't forget to join channels/groups given below and get what you dream in your life. ✌🏻</blockquote>

users_scanned=
  <blockquote>Total number of users scanned: { $usersLength }</blockquote>

no_message_to_broadcast=
  <blockquote>No message to broadcast!</blockquote>

  Please mention the message that you want to broadcast.

no_users_to_broadcast=
  Not enough users are recorded yet!

  <blockquote>Please try again later</blockquote>

broadcasting_message=
  <blockquote>Broadcasting your message to { $length } members</blockquote>

broadcasting_progress=
  <blockquote>Broadcast in progress!</blockquote>

  Estimated time: <code>{ $estimatedTime }</code>
  Total Users: <code>{ $length }</code>
  Success: <code>{ $successCount }</code>
  Blocked: <code>{ $blockedCount }</code>
  Deleted: <code>{ $unknownErrorCount }</code>

broadcast_complete=
  <blockquote>Broadcast completed!</blockquote>

  Completed in: <code>{ $time }</code>
  Total Users: <code>{ $length }</code>
  Success: <code>{ $successCount }</code>
  Blocked: <code>{ $blockedCount }</code>
  Deleted: <code>{ $unknownErrorCount }</code>

welcome_message_channels_given=
  Don't forget to join channels given below and get what you dream in your life. ✌🏻

channel_already_exists=
  Sorry but that channel already exists.

  Please use <code>/del channelId</code> if you want to delete or add again.

adding_channel=
  <blockquote>Adding files from <code>{ $channelId }</code> in database</blockquote>

error_while_adding_files=
  <code>{ $errorMessage }</code>

  Error while adding files. It maybe because channel doesn't exist.

  Be sure the account that you are using for bot is added to the channel that you are trying to add.

adding_finished=
  <blockquote>Added { $fileLength } files from <code>{ $channelId }</code> successfully.</blockquote>

finding_files_in_channel=
  <blockquote>Finding for files in <code>{ $channelId }</code></blockquote>

found_files_in_channel=
  <blockquote>Found { $filesCount } files from <code>{ $channelId }</code></blockquote>

no_channels_found=
  <blockquote>No channels found!</blockquote>

channel_not_found_delete=
  <blockquote>Channel that you are trying to delete i.e. <code>{ $channelId }</code> not found!</blockquote>

channel_not_found_refresh=
  <blockquote>Channel that you are trying to refresh i.e. <code>{ $channelId }</code> not found!</blockquote>

refreshing_all_channels_deleting=
  <blockquote>Refreshing all channels</blockquote>

  <strong>Status</strong>: Deleting { $totalChannels } channels

refreshing_channel_deleting=
  <blockquote>Refreshing { $channelId }</blockquote>

  <strong>Status</strong>: Deleting channel

refreshing_all_channels_adding=
  <blockquote>Refreshing all channels</blockquote>

  <strong>Status</strong>: Adding (<code>{ $channelId }</code>)
  <strong>{ $remainingChannels }/{ $totalChannels } Done</strong>

refreshing_channel_adding=
  <blockquote>Refreshing { $channelId } channel.</blockquote>

  <strong>Status</strong>: Adding channel

refreshing_all_finished=
  All channels refreshed successfully!

  Total Channels refreshed: { $totalChannels }

refreshing_finished=
  <blockquote><code>{ $channelId }</code> refreshed successfully!</blockquote>

deleting_channel=
  <blockquote>Deleting files of <code>{ $channelId }</code> from database.</blockquote>

error_while_deleting_files=
  <code>{ $errorMessage }</code>

  Error while deleting channel. Please check logs for more info.

deleting_finished=
  <blockquote><code>{ $channelId }</code> deleted Successfully!</blockquote>

deleting_all_channels= 
  <blockquote>Deleting all channels from database.</blockquote>

deleting_all_finished=
  <blockquote>All channels deleted Successfully.</blockquote>

pass_valid_channel_id=
  <blockquote>Please pass a valid channelID after the command</blockquote>

filter_stats_head_title=
  <blockquote>All channels added to the bot are:</blockquote>


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
