import { WebClient } from "@slack/web-api";
import cfg from "../config";

if (!cfg.slackToken) {
  console.warn('[WARN] Missing Slack token — Slack calls will fail.');
}

const slack = new WebClient(cfg.slackToken);

export default slack;