
export enum UserRole {
  FACULTY = 'FACULTY',
  CR = 'CR'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  section?: string;
  phone?: string;
  isVerified?: boolean;
  profilePic?: string;
}

export interface VerificationRequest {
  user: User;
  method: 'SMS' | 'EMAIL';
  target: string;
  code: string;
}

export interface TacticalNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'UPDATE' | 'SECURITY';
  timestamp: string;
}

export interface AttendanceRecord {
  id: string;
  sectionId: string;
  strength: number;
  crId: string;
  crName: string;
  facultyName: string;
  timestamp: string;
  period: number;
  date: string;
}

export interface VoiceLog {
  id: string;
  command: string;
  response: string;
  timestamp: string;
  intent: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPic?: string;
  text: string;
  timestamp: string;
  status: 'sending' | 'sent' | 'delivered' | 'seen';
  isSystem?: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  type: 'GROUP' | 'DIRECT';
  participants: string[];
  lastMessage?: string;
  lastTimestamp?: string;
  unreadCount?: number;
  icon?: string;
}

export interface Section {
  id: string;
  name: string;
  facultyName: string;
  facultyPhone: string;
  facultyPic?: string;
  crs: Array<{
    name: string;
    phone: string;
    email: string;
    isVerified?: boolean;
    reliability?: number;
    profilePic?: string;
    requestMessage?: string;
    requestTimestamp?: string;
  }>;
  currentStrength: number;
  lastUpdate: string;
}
