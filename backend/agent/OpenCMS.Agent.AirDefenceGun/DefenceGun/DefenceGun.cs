namespace OpenCMS.Agent.AirDefenceGun
{
    public class DefenceGun
    {
        private readonly AgentState _selfAgent;
        public DefenceGun(AgentState selfAgent)
        {
            _selfAgent = selfAgent;
        }

        public async Task TakePosition(Asset targetAsset)
        {
            // fake waiting for the gun to take position
            await Task.Delay(1000);

            System.Console.WriteLine($">>Positioned to target: {targetAsset.Id} at {targetAsset.Latitude}/{targetAsset.Longitude}");
        }

        public async Task Fire()
        {
            // fake waiting for the gun to fire
            await Task.Delay(100);

            System.Console.WriteLine(">>>>>>>>>>>>>>>> Fired <<<<<<<<<<<<<<<<<");
        }
    }
}