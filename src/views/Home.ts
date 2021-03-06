import { Component, Vue, Watch } from 'vue-property-decorator';
import router from '@/router';
import WizardService from '@/services/wizard.service';
import { Wizard } from '@/shared/models/Wizard';
import ApiResponse from '@/shared/models/ApiResponse';
import Player from '@/shared/models/Player';
import LeaderboardWizardPowerComponent from '@/components/leaderboard/wizards/power/LeaderboardWizardPower';
import LeaderboardPlayerPowerComponent from '@/components/leaderboard/players/power/LeaderboardPlayerPower';
import LeaderboardPlayerWinsComponent from '@/components/leaderboard/players/wins/LeaderboardPlayerWins';
import LeaderboardWizardWinsComponent from '@/components/leaderboard/wizards/wins/LeaderboardWizardWins';
import LeaderboardPlayerWizardsComponent from '@/components/leaderboard/players/wizards/LeaderboardPlayerWizards';
import { LeaderboardCategory } from '@/shared/models/LeaderboardCategory';

@Component({
    components: {
        LeaderboardWizardPowerComponent,
        LeaderboardWizardWinsComponent,
        LeaderboardPlayerPowerComponent,
        LeaderboardPlayerWinsComponent,
        LeaderboardPlayerWizardsComponent,
    },
})
export default class Home extends Vue {
    public searchTerm: string;
    public service: WizardService;
    public topWizards: Wizard[];
    public topPlayers: Player[];
    public searchCategory: string;
    public searchCategories: string[];
    public placeholder: string;
    public leaderboardCategory: string;
    public leaderboardSubCategory: string;
    public loadingLeaderboards: boolean;

    constructor() {
        super();

        this.searchTerm = '';
        this.leaderboardCategory = 'wizards';
        this.leaderboardSubCategory = 'power';
        this.service = new WizardService();
        this.topWizards = [];
        this.topPlayers = [];
        this.searchCategories = ['wizard', 'player'];
        this.searchCategory = this.searchCategories[0];
        this.placeholder = 'Id...';
        this.loadingLeaderboards = true;

        // tslint:disable-next-line:max-line-length
        this.service.getTopWizards(LeaderboardCategory.Power, 100).then((response: ApiResponse<Wizard[]>) => this.setTopWizards(response.result));
    }

    public get isWizardsActive(): boolean {
        return this.leaderboardCategory === 'wizards';
    }

    public get isPlayersActive(): boolean {
        return this.leaderboardCategory === 'players';
    }

    public get isPowerActive(): boolean {
        return this.leaderboardSubCategory === 'power';
    }

    public get isWinsActive(): boolean {
        return this.leaderboardSubCategory === 'wins';
    }

    public get isWizardsCountActive(): boolean {
        return this.leaderboardSubCategory === 'wizardscount';
    }

    @Watch('leaderboardCategory')
    @Watch('leaderboardSubCategory')
    public onLeaderboardCategoryChange() {
        if (this.leaderboardCategory === 'wizards') {
            if (this.leaderboardSubCategory === 'wizardscount') {
                this.leaderboardSubCategory = 'power';
            } else if (this.leaderboardSubCategory === 'power') {
                this.loadingLeaderboards = true;
                // tslint:disable-next-line:max-line-length
                this.service.getTopWizards(LeaderboardCategory.Power, 100).then((response: ApiResponse<Wizard[]>) => this.setTopWizards(response.result));
            } else if (this.leaderboardSubCategory === 'wins') {
                this.loadingLeaderboards = true;
                // tslint:disable-next-line:max-line-length
                this.service.getTopWizards(LeaderboardCategory.Wins, 100).then((response: ApiResponse<Wizard[]>) => this.setTopWizards(response.result));
            }
        } else if (this.leaderboardCategory === 'players') {
            this.loadingLeaderboards = true;
            if (this.leaderboardSubCategory === 'wizardscount') {
                // tslint:disable-next-line:max-line-length
                this.service.getTopPlayers(LeaderboardCategory.Wizards, 100).then((response: ApiResponse<Player[]>) => this.setTopPlayers(response.result));
            } else if (this.leaderboardSubCategory === 'power') {
                // tslint:disable-next-line:max-line-length
                this.service.getTopPlayers(LeaderboardCategory.Power, 100).then((response: ApiResponse<Player[]>) => this.setTopPlayers(response.result));
            } else if (this.leaderboardSubCategory === 'wins') {
                // tslint:disable-next-line:max-line-length
                this.service.getTopPlayers(LeaderboardCategory.Wins, 100).then((response: ApiResponse<Player[]>) => this.setTopPlayers(response.result));
            }
        }
    }

    @Watch('searchCategory')
    public onSearchCategoryChange() {
        if (this.searchCategory === 'wizard') {
            this.placeholder = 'Id...';
        } else {
            this.placeholder = 'Address...';
        }
    }

    public setTopWizards(wizards: Wizard[]) {
        this.loadingLeaderboards = false;
        if (this.leaderboardSubCategory === 'power') {
            this.topWizards = wizards.sort((w1, w2) => {
                const p1 = Number.parseInt(w1.power, 10);
                const p2 = Number.parseInt(w2.power, 10);
                return p2 - p1;
            });
        } else if (this.leaderboardSubCategory === 'wins') {
            this.topWizards = wizards.sort((w1, w2) => {
                const p1 = w1.wins;
                const p2 = w2.wins;
                return p2 - p1;
            });
        }
    }

    public setTopPlayers(players: Player[]) {
        this.loadingLeaderboards = false;
        this.topPlayers = players;
        if (this.leaderboardSubCategory === 'power') {
            this.topPlayers.sort((a: Player, b: Player) => b.wizardPowerSum - a.wizardPowerSum);
        } else if (this.leaderboardSubCategory === 'wizards') {
            this.topPlayers.sort((a: Player, b: Player) => a.wizardCount - b.wizardCount);
        }
    }

    public lookup() {
        if (this.searchCategory === 'wizard') {
            let id = this.searchTerm;
            if (id.substring(0, 1) === '0') {
                id = id.substring(1);
            }
            router.push('wizards/' + id);
        } else {
            router.push('players/' + this.searchTerm);
        }
    }
}
