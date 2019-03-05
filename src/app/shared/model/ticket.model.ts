import { Date } from "../date.util";

export const TICKET_STATUS = {
  'Open': 2,
  'Pending': 3,
  'Resolved': 4,
  'Closed': 5
}

export interface TicketResponse {
  associated_tickets_count: number;
  association_type: number;
  cc_emails: string[];
  company_id: number;
  created_at: string;
  description: string;
  description_text: string;
  due_by: string;
  email_config_id: number;
  fr_due_by: string;
  fr_escalated: boolean;
  fwd_emails: string[];
  group_id: number;
  id: number;
  is_escalated: boolean;
  priority: boolean;
  product_id: number;
  reply_cc_emails: string[];
  requested_id: boolean;
  responder_id: boolean;
  source: number;
  spam: boolean;
  status: number;
  subject: string;
  tags: string[];
  to_emails: string;
  type: string;
  updated_at: string;
}

export interface TicketPayload {
  email: string;
}

export class Ticket {
  createdAt: Date;
  description: string;
  descriptionText: string;
  dueBy: Date;
  groupId: number;
  id: number;
  isEscalated: boolean;
  priority: boolean;
  requestedId: boolean;
  responderId: boolean;
  source: number;
  spam: boolean;
  status: number;
  subject: string;
  updatedAt: Date;
  fromDueBy: Date;
}

export class TicketList {
  items: Ticket[];
  openCount: number = 0;
  pendingCount: number = 0;
  resolvedCount: number = 0;
  closedCount: number = 0;

  static fromResponse(response: TicketResponse[]): TicketList {
    const ticketList = new TicketList();

    let openCount = 0;
    let pendingCount = 0;
    let resolvedCount = 0;
    let closedCount = 0;

    if (response[0].hasOwnProperty('id')) {
      ticketList.items = response.map((response: TicketResponse): Ticket => {
        switch (response.status) {
          case TICKET_STATUS.Open:
            ticketList.openCount = ++openCount;
          break;
          case TICKET_STATUS.Pending:
            ticketList.pendingCount = ++pendingCount;
          break;
          case TICKET_STATUS.Resolved:
            ticketList.resolvedCount = ++resolvedCount;
          break;
          case TICKET_STATUS.Closed:
            ticketList.closedCount = ++closedCount;
          break;
        }

        const ticket = new Ticket();

        ticket.createdAt = new Date(response.created_at);
        ticket.description = response.description,
        ticket.descriptionText = response.description_text,
        ticket.dueBy = new Date(response.due_by),
        ticket.groupId = response.group_id,
        ticket.id = response.id,
        ticket.isEscalated = response.is_escalated,
        ticket.priority = response.priority,
        ticket.requestedId = response.requested_id,
        ticket.responderId = response.responder_id,
        ticket.source = response.source,
        ticket.spam = response.spam,
        ticket.status = response.status,
        ticket.subject = response.subject,
        ticket.updatedAt = new Date(response.updated_at),
        ticket.fromDueBy = new Date(response.fr_due_by)

        return ticket;
      });

    } else {
      ticketList.items = [];
    }

    return ticketList;
  }
}

export interface ZendeskTicketPayload {
  ticketId: number;
}

export interface ZendeskTicketResponse {
  tickets: {
    created_at: string;
    description: string;
    id: number;
    priority: string;
    raw_subject: string;
    requester_id: string;
    status: string;
    subject: string;
    submitter_id: number;
    type: string;
  }[],
  summary: {
    closed: number;
    open: number;
    pending: number;
    solved: number;
  }
}

export class ZendeskTicket {
  createdAt: Date;
  description: string;
  id: number;
  priority: string;
  rawSubject: string;
  requesterId: string;
  status: string;
  subject: string;
  submitterId: number;
  type: string;
  comments: TicketComment[];
}

export class ZendeskTicketList {
  items: ZendeskTicket[];
  closed: number;
  open: number;
  pending: number;
  solved: number;

  static fromResponse(response: ZendeskTicketResponse): ZendeskTicketList {
    const zendeskTicketList = new ZendeskTicketList();

    zendeskTicketList.items = response.tickets.map((response): ZendeskTicket => {
      const zendeskTicket = new ZendeskTicket();

      zendeskTicket.createdAt = new Date(response.created_at);
      zendeskTicket.description = response.description;
      zendeskTicket.id = response.id;
      zendeskTicket.priority = response.priority;
      zendeskTicket.rawSubject = response.raw_subject;
      zendeskTicket.requesterId = response.requester_id;
      zendeskTicket.status = response.status;
      zendeskTicket.subject = response.subject;
      zendeskTicket.submitterId = response.submitter_id;
      zendeskTicket.type = response.type;

      return zendeskTicket;
    });

    zendeskTicketList.closed = response.summary.closed;
    zendeskTicketList.open = response.summary.open;
    zendeskTicketList.pending = response.summary.pending;
    zendeskTicketList.solved = response.summary.solved;

    return zendeskTicketList;
  }
}

export interface TicketCommentsReponse {
  comments: {
    audit_id: number;
    author_id: number;
    body: string;
    created_at: string;
    html_body: string;
    id: number;
    plain_body: string;
    type: string;
    via: {
      channel: string
    };
  }[],
  count: number;
  next_page: any;
  previous_page: any;
}

export class TicketComment {
  auditId: number;
  authorId: number;
  body: string;
  createdAt: Date;
  htmlBody: string;
  id: number;
  plainBody: string;
  type: string;
  channel: string;
  ticketId: number;
  ticketContent: string;
}

export class TicketCommentList {
  comments: TicketComment[];
  count: number;
  nextPage: any;
  previousPage: any;

  static fromResponse(response: TicketCommentsReponse, ticketId: any): TicketCommentList {
    const commentList = new TicketCommentList();

    commentList.comments = response.comments.map((response): TicketComment => {
      const comments = new TicketComment();

      comments.auditId = response.audit_id;
      comments.authorId = response.author_id;
      comments.body = response.body;
      comments.createdAt = new Date(response.created_at);
      comments.htmlBody = response.html_body;
      comments.id = response.id;
      comments.plainBody = response.plain_body;
      comments.type = response.type;
      comments.channel = response.via.channel;
      comments.ticketId = ticketId;
      comments.ticketContent = (response.via.channel == 'chat') ? 'chat' : 'ticket';

      return comments;
    });

    commentList.count = response.count;
    commentList.nextPage = response.next_page;
    commentList.previousPage = response.previous_page

    return commentList;
  }
}