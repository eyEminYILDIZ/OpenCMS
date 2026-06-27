import { AgentApi } from "../../api";
import i18n from "../../i18n";
import type { DropdownOption } from "../../components/ui/Dropdown";

const { t } = i18n;

export const agentTypeLabels: Record<AgentApi.Enums.AgentTypes, string> = {
    [AgentApi.Enums.AgentTypes.ComputerProgram]: t('agent.agentTypes.computerProgram'),
    [AgentApi.Enums.AgentTypes.Person]: t('agent.agentTypes.person'),
    [AgentApi.Enums.AgentTypes.InputOutput]: t('agent.agentTypes.inputOutput'),
    [AgentApi.Enums.AgentTypes.InputOnly]: t('agent.agentTypes.inputOnly'),
    [AgentApi.Enums.AgentTypes.OutputOnly]: t('agent.agentTypes.outputOnly'),
};

export const agentTypeOptions: DropdownOption[] = Object.values(AgentApi.Enums.AgentTypes)
    .filter((v): v is AgentApi.Enums.AgentTypes => typeof v === 'number')
    .map((type) => ({ value: type, label: agentTypeLabels[type] }));