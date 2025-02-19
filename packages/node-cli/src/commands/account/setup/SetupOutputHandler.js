/*
 ** Copyright (c) 2024 Oracle and/or its affiliates.  All rights reserved.
 ** Licensed under the Universal Permissive License v 1.0 as shown at https://oss.oracle.com/licenses/upl.
 */
'use strict';
const BaseOutputHandler = require('../../base/BaseOutputHandler');
const NodeTranslationService = require('../../../services/NodeTranslationService');

const {
	COMMAND_SETUPACCOUNT: { MESSAGES, OUTPUT },
	UTILS: { AUTHENTICATION },
} = require('../../../services/TranslationKeys');

const {
	LINKS: {
		ERRORS: {
			AUTHENTICATION_FALLBACK_INFO,
		},
	}
} = require('../../../ApplicationConstants');

const AUTH_MODE = {
	OAUTH: 'OAUTH',
	SAVE_TOKEN: 'SAVE_TOKEN',
	REUSE: 'REUSE',
};

module.exports = class SetupOutputHandler extends BaseOutputHandler {
	constructor(options) {
		super(options);
	}

	parse(actionResult) {
		let resultMessage;
		switch (actionResult.mode) {
			case AUTH_MODE.OAUTH:
				resultMessage = NodeTranslationService.getMessage(
					OUTPUT.NEW_OAUTH,
					actionResult.accountInfo.companyName,
					actionResult.accountInfo.roleName,
					actionResult.authId
				);
				break;
			case AUTH_MODE.REUSE:
				resultMessage = NodeTranslationService.getMessage(
					OUTPUT.REUSED_AUTH_ID,
					actionResult.authId,
					actionResult.accountInfo.companyName,
					actionResult.accountInfo.roleName
				);
				break;
			default:
				break;
		}

		this._log.result(resultMessage);
		this._log.result(NodeTranslationService.getMessage(AUTHENTICATION.SUCCESS_SETUP));

		if (actionResult.isSuccess() && process.env.SUITECLOUD_FALLBACK_PASSKEY) {
			this._log.warning(NodeTranslationService.getMessage(MESSAGES.ROTATE_PASSWORD_WARNING, AUTHENTICATION_FALLBACK_INFO));
		}

		return actionResult;
	}
};
