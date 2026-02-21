import { AstraeaService } from '../../services/AstraeaService';
import { VapiService } from '../../services/VapiService';
import { NavigatorGem } from '../../services/gems/NavigatorGem';

describe('AstraeaService', () => {
  let astraeaService: AstraeaService;
  let mockVapiService: jest.Mocked<VapiService>;
  let mockNavigatorGem: jest.Mocked<NavigatorGem>;

  beforeEach(() => {
    mockVapiService = {
      createAssistant: jest.fn().mockResolvedValue({ id: 'assistant-123' }),
      createCall: jest.fn().mockResolvedValue({ id: 'call-123' }),
      updateAssistant: jest.fn().mockResolvedValue({}),
    } as any;

    mockNavigatorGem = {
      id: 'navigator-gem',
      scanTacticalRadar: jest.fn().mockResolvedValue('Sector scans clear. Sector 7G detected.'),
    } as any;

    astraeaService = new AstraeaService(mockVapiService, mockNavigatorGem);
  });

  describe('startSovereignSession', () => {
    it('should initialize a session with spatial context', async () => {
      const result = await astraeaService.startSovereignSession('client-1', { lat: 40, lng: -3 });

      expect(mockNavigatorGem.scanTacticalRadar).toHaveBeenCalledWith({ lat: 40, lng: -3 });
      expect(mockVapiService.createAssistant).toHaveBeenCalledWith(
        'Astraea',
        expect.stringContaining('Sector 7G'),
      );
      expect(result).toEqual(expect.objectContaining({ assistantId: 'assistant-123' }));
    });
  });

  describe('induceCall', () => {
    it('should induce a phonic call with spatial context', async () => {
      const result = await astraeaService.induceCall('client-1', '+123456789');

      expect(mockVapiService.createAssistant).toHaveBeenCalled();
      expect(mockVapiService.createCall).toHaveBeenCalledWith('+123456789', 'assistant-123');
      expect(result).toEqual({ callId: 'call-123' });
    });
  });
});
