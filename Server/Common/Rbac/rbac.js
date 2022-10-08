// ====== --- ====== > Modules endpoints < ====== --- ====== //
const Rbac = require("easy-rbac");
const chatEndpoints = require("../../modules/chat/chatEndpoints");
const userEndpoints = require("../../modules/users/userEndpoints");
const roles = require("../Enum/roles");
// ====== --- ====== > Roles policies < ====== --- ====== //
const userPolicies = [
  userEndpoints.SearchUserByNameOrEmailAPI,
  chatEndpoints.AccessChatAPI,
  chatEndpoints.GetUserChatsAPI,
  chatEndpoints.CreateGroupChatAPI,
  chatEndpoints.RenameChatGroupAPI,
  chatEndpoints.RemoveChatMemberAPI,
  chatEndpoints.AddChatMemberAPI,
];
const adminPolicies = [];
const superAdminPolicies = [];

// ====== --- ====== > Match Between Roles & Them EndPoints < ====== --- ====== //
const opts = {
  [roles.USER]: {
    can: userPolicies,
  },
  [roles.ADMIN]: {
    can: adminPolicies,
    inherits: [roles.USER],
  },
  [roles.SUPER_ADMIN]: {
    can: superAdminPolicies,
    inherits: [roles.ADMIN, roles.USER],
  },
};

// ====== --- ====== > Create rbac of user module < ====== --- ====== //
userRbac = Rbac.create(opts);

// ====== --- ====== > Exports userRabac < ====== --- ====== //
module.exports = userRbac;
