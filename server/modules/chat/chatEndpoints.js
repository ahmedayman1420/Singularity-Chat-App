// ====== --- ====== > Chat module endpoints < ====== --- ====== //
const AccessChatAPI = "Chat:AccessChatAPI";
const GetUserChatsAPI = "Chat:GetUserChatsAPI";
const CreateGroupChatAPI = "Chat:CreateGroupChatAPI";
const RenameChatGroupAPI = "Chat:RenameChatGroupAPI";
const RemoveChatMemberAPI = "Chat:RemoveChatMemberAPI";
const AddChatMemberAPI = "Chat:AddChatMemberAPI";

const chatEndpoints = {
  AccessChatAPI,
  GetUserChatsAPI,
  CreateGroupChatAPI,
  RenameChatGroupAPI,
  RemoveChatMemberAPI,
  AddChatMemberAPI,
};

// ====== --- ====== > Export chat endpoints < ====== --- ====== //
module.exports = chatEndpoints;
