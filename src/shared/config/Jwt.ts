type JwtHeader = {
    alg: string;
    typ: string;
    [key: string]: string;
  };

  type Permission = {
    _id: string;
    key: string;
  }

  

  type JwtPayload = {
  id: string;
  email: string;
  name: string;
  role: {
    id: string;
    key: string;
    permissions: Permission[];
  }
};
  
  type DecodedToken = {
    header: JwtHeader;
    payload: JwtPayload;
  } | null;
  
  function base64UrlDecode(str: string): string {
    try {
      // Convert from base64url to base64
      str = str.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if needed
      const pad = str.length % 4;
      if (pad) {
        str += '='.repeat(4 - pad);
      }
      return atob(str);
    } catch (error) {
      console.error('Error decoding base64:', error);
      throw new Error('Invalid base64 encoding');
    }
  }
  
  export const decodeToken = (token: string): DecodedToken => {
    try {
      if (!token || typeof token !== 'string') {
        return null;
      }

      const parts = token.split('.');
      
      if (parts.length !== 3) {
        return null;
      }

      const [header, payload] = parts;
  
      if (!header || !payload) {
        return null;
      }
  
      const decodedHeader = base64UrlDecode(header);
      const decodedPayload = base64UrlDecode(payload);
  
      return {
        header: JSON.parse(decodedHeader),
        payload: JSON.parse(decodedPayload),
      };
    } catch {
      return null;
    }
  };
  